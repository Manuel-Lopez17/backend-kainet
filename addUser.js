import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

// Configurar Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

const crearUsuario = async (nombre, email, habilitado = true) => {
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

// Obtener los argumentos de la línea de comandos
const args = process.argv.slice(2);
const [nombre, email] = args;

if (!nombre || !email) {
    console.error('Faltan datos o son incorrectos. Uso: node addUser.js <nombre> <email>');
    process.exit(1);
}

(async () => {
    try {
        const newUser = await crearUsuario(nombre, email);
        console.log('Usuario creado:', newUser);
    } catch (error) {
        console.error('Error al crear el usuario:', error.message);
    }
})();
