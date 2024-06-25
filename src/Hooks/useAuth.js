import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../lib/supabase"
import { login, logout } from "../Store/Auth/AuthSlice";
import Cookies from "js-cookie";
import { Encrypt } from "../Helpers/Encrypt";
import { onLogoutIncident } from "../Store/Incident/IncidentSlice";


export const useAuth = () => {

    const dispatch = useDispatch()
    const { status } = useSelector((state) => state.auth)
    const { encryptData, decryptData } = Encrypt()

    const startLogin = async ({ email, password }) => {
        try {
            // Realizar la consulta a la tabla 'profiles' para obtener el perfil con el email dado
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select("*")
                .eq('email', email);
            console.log(profiles);

            if (error) {
                console.log('Error al consultar perfiles:', error);
                return { success: false, message: 'Error al consultar perfiles' };
            }

            // Verificar si se encontró un perfil con el email dado
            if (profiles.length === 0) {
                console.log('Email no encontrado');
                return { success: false, message: 'Email no encontrado' };
            }

            // Extraer el perfil encontrado
            const profile = profiles[0];

            const decryptPassword = decryptData(profile.password, import.meta.env.VITE_SECRET_KEY)
            // Verificar si la contraseña proporcionada coincide con la almacenada
            if (decryptPassword.replace(/['"]+/g, '') !== password) {
                console.log('Contraseña incorrecta');
                return { success: false, message: 'Contraseña incorrecta' };
            }

            // Generar un token de autenticación (esto es solo un ejemplo, deberías usar JWT u otro método seguro)

            const authToken = encryptData(email, import.meta.env.VITE_SECRET_KEY)

            // Guardar el token en una cookie
            Cookies.set('authToken', authToken, { expires: 7 }); // La cookie expira en 7 días

            // Llamar al dispatch con el perfil (puedes ajustar esto según tu implementación)
            dispatch(login(profile));

            return { success: true, message: 'Inicio de sesión exitoso' };
        } catch (error) {
            // Manejar cualquier error inesperado
            console.log('Error inesperado:', error);
            return { success: false, message: 'Error inesperado' };
        }
    };


    const CheckAuth = async () => {
        const authToken = Cookies.get('authToken');
        if (authToken) {
            const emailDecrypt = decryptData(authToken, import.meta.env.VITE_SECRET_KEY);
            const email = emailDecrypt.replace(/['"]+/g, '')
            try {
                let { data: profiles, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('email', email);

                if (error || profiles.length === 0) {
                    console.log('Error al obtener perfil:', error || 'Perfil no encontrado');
                    dispatch(onLogoutIncident())
                    dispatch(logout())
                    return;
                }

                const profile = profiles[0];
                dispatch(login(profile)); // Actualiza el estado con el perfil
            } catch (error) {
                dispatch(onLogoutIncident())
                dispatch(logout())
                console.log('Error al obtener perfil:', error);
            }
        }else{
            dispatch(onLogoutIncident())
            dispatch(logout())
        }
    };


    const startRegister = async ({ first_name, last_name, phone, email, password }) => {
        try {
            // Verificar si el correo ya está registrado
            const { data: existingUser, error: fetchError } = await supabase
                .from('profiles')
                .select('email')
                .eq('email', email)
                .single();
    
            if (fetchError && fetchError.code !== 'PGRST116') {
                // Manejar errores que no sean de "no encontrado"
                throw fetchError;
            }
    
            if (existingUser) {
                // El correo ya está registrado
                console.log('El correo ya está registrado');
                return existingUser;
            }
    
            // Encriptar la contraseña
            const passwordEncrypt = encryptData(password, import.meta.env.VITE_SECRET_KEY);
    
            // Insertar el nuevo usuario
            const { data, error } = await supabase
                .from('profiles')
                .insert([{
                    nombre: first_name,
                    apellido: last_name,
                    email: email,
                    phone: phone,
                    password: passwordEncrypt
                }])
                .select();
    
            if (error) {
                console.log(error);
                return;
            }
    
            console.log(data);
    
        } catch (error) {
            console.log(error);
        }
    };

    const starLogout = () => {
        try {
            Cookies.remove('authToken');
            localStorage.removeItem('activeIncident');
            dispatch(onLogoutIncident())
            dispatch(logout())
        } catch (error) {
            console.log('error');
        }
    }



    return {
        status,
        startLogin,
        CheckAuth,
        startRegister,
        starLogout
    }
}

