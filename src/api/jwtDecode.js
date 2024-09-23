import jwtDecode from 'jwt-decode';

export const decodeJwt = () =>{
    const token = localStorage.getItem("token");
    if (token) {    
        try {
            const decoded = jwtDecode(token)
            const userId = decoded.data.sub;
            const email = decoded.data.email;
            const permission = decoded.data.permission;
            return {userId, email, permission}
        } catch (err) {
            console.log(err)
        }
    }
}