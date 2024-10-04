import { useContext, useState } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { login } from '../utill/auth';
import { Alert } from 'react-native';
import { AuthContext } from '../store/auth-context';



function LoginScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const authCtx = useContext(AuthContext);
    async function loginHandler({ email, password }) {
        setIsAuthenticating(true);
        // console.log("Email:", email);
        // console.log("Password:", password);
        try {
            const token = await login(email, password);
            authCtx.authenticate(token);
            // console.log('token', token)
        } catch (error) {
            Alert.alert('Authentication Failed!',     // title for alert
                'plz check your credentials or try again'
            ); // message
            setIsAuthenticating(false);
        }

    }

    if (isAuthenticating) {
        return <LoadingOverlay message="Logging you In..." />;
    }
    return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;