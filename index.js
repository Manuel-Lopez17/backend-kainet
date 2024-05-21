import express from 'express';
import { createClient } from '@supabase/supabase-js';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabaseUrl = 'https://fmmpkexoukmjktqrgdrk.supabase.co';
// const supabaseKey = process.env.SUPABASE_KEY;
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtbXBrZXhvdWttamt0cXJnZHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyMDg0NTYsImV4cCI6MjAzMTc4NDQ1Nn0.iTaRMzW7IQtl01HgYnM54MMKCJ7eW1PUadGCoi0lw1s';

const supabase = createClient(supabaseUrl, supabaseKey);

const port = process.env.PORT || 3000;


const obtenerPosicionesPaginadas = async (page, perPage) => {
    const { data, error, count } = await supabase
        .from('Posicion')
        .select('id,fechaEntregaInicio, moneda, precio, Producto(usoFrecuente,nombre),Empresa(razonSocial)', { count: 'exact' })
        .order('usoFrecuente', { ascending: false, foreignTable: 'Producto' })
        .range((page - 1) * perPage, page * perPage - 1);

    if (error) {
        throw error;
    }

    return {
        total: count,
        page,
        perPage,
        posiciones: data,
    };
};

app.get('/posiciones', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const order = req.query.order || 'desc';


    try {
        const result = await obtenerPosicionesPaginadas(page, perPage);
        if (order === "asc") {
            result.posiciones = result.posiciones.sort((a, b) => a.Producto.usoFrecuente - b.Producto.usoFrecuente);
        } else {
            result.posiciones = result.posiciones.sort((a, b) => b.Producto.usoFrecuente - a.Producto.usoFrecuente);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Usuario').select('nombre,email,habilitado');

        res.json(data)

    } catch (error) {
        res.status(500).json({ error: error.message });

    }
})

const usuarioExiste = async (mail) => {
    const { data, error } = await supabase
        .from('Usuario')
        .select('id')
        .eq('email', mail);

    if (error) {
        throw error;
    }

    return data.length > 0;
};

const crearUsuario = async (nombre, email, habilitado) => {
    const usuarioYaExiste = await usuarioExiste(email);

    if (usuarioYaExiste) {
        throw new Error('El usuario ya está registrado');
    }

    const id = uuidv4();
    const { data, error } = await supabase
        .from('Usuario')
        .insert([
            { id, nombre, email, habilitado }
        ]).select();

    if (error) {
        throw error;
    }

    return data;
};

app.post('/usuarios', async (req, res) => {
    const { nombre, email, habilitado } = req.body;

    if (!nombre || !email || typeof habilitado !== 'boolean') {
        return res.status(400).json({ error: 'Faltan datos o son incorrectos' });
    }

    try {
        const newUser = await crearUsuario(nombre, email, habilitado);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`port runing in http://localhost:${port}`);
});