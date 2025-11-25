import AuthLayout from '@/components/layouts/AuthLayout';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
    return (
        <AuthLayout
            wrapperClass="_social_login_wrapper"
            wrapClass="_social_login_wrap"
            imageSection={
                <div className="_social_login_left">
                    <div className="_social_login_left_image">
                        <img src="/assets/images/login.png" alt="Image" className="_left_img" />
                    </div>
                </div>
            }
        >
            <LoginForm />
        </AuthLayout>
    );
}
