'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!agreeToTerms) {
            setError('Please agree to terms & conditions');
            return;
        }

        setLoading(true);

        const result = await register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
        });

        if (!result.success) {
            setError(result.error || 'Registration failed');
        }

        setLoading(false);
    };

    return (
        <div className="_social_registration_content">
            <div className="_social_registration_right_logo _mar_b28">
                <img src="/assets/images/logo.svg" alt="Image" className="_right_logo" />
            </div>
            <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
            <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>

            {error && (
                <div className="alert alert-danger _mar_b20" role="alert">
                    {error}
                </div>
            )}

            <form className="_social_registration_form" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                            <label className="_social_registration_label _mar_b8">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                className="form-control _social_registration_input"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                            <label className="_social_registration_label _mar_b8">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                className="form-control _social_registration_input"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                            <label className="_social_registration_label _mar_b8">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control _social_registration_input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                            <label className="_social_registration_label _mar_b8">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control _social_registration_input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                            <label className="_social_registration_label _mar_b8">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control _social_registration_input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                        <div className="form-check _social_registration_form_check">
                            <input
                                className="form-check-input _social_registration_form_check_input"
                                type="checkbox"
                                id="agreeToTerms"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                disabled={loading}
                            />
                            <label className="form-check-label _social_registration_form_check_label" htmlFor="agreeToTerms">
                                I agree to terms & conditions
                            </label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                        <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                            <button
                                type="submit"
                                className="_social_registration_form_btn_link _btn1"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register now'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                        <p className="_social_registration_bottom_txt_para">
                            Already have an account? <Link href="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
