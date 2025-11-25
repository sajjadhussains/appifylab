import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    wrapperClass: string;
    wrapClass: string;
    imageSection: React.ReactNode;
}

export default function AuthLayout({ children, wrapperClass, wrapClass, imageSection }: AuthLayoutProps) {
    return (
        <section className={`${wrapperClass} _layout_main_wrapper`}>
            <div className="_shape_one">
                <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape.svg" alt="" className="_dark_shape" />
            </div>
            <div className="_shape_two">
                <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" />
            </div>
            <div className="_shape_three">
                <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" />
            </div>
            <div className={wrapClass}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                            {imageSection}
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
