import AuthLayout from '@/components/layouts/AuthLayout';
import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
    return (
        <AuthLayout
            wrapperClass="_social_registration_wrapper"
            wrapClass="_social_registration_wrap"
            imageSection={
                <div className="_social_registration_right">
                    <div className="_social_registration_right_image">
                        <img src="/assets/images/registration.png" alt="Image" />
                    </div>
                    <div className="_social_registration_right_image_dark">
                        <img src="/assets/images/registration1.png" alt="Image" />
                    </div>
                </div>
            }
        >
            <RegisterForm />
        </AuthLayout>
    );
}
