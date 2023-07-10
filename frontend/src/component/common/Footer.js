import React from 'react';
import Common from "./Common";
import logo from '../../src_assets/logo(basic).png';
import './scss/Footer.scss'

const Footer = () => {

    const text = '현재 사이트는 프로젝트를 위해 작성되었으며, 비상업적인 목적으로 사용됩니다.\nCopyright © 2023 ddamddamclub.';
    return (
        <Common className={'footer-wrapper'}>
                {/*<div>*/}
                {/*    <img src={logo} alt={'logo'} className={'logo'}/>*/}
                {/*</div>*/}

                <div className={'copyright'}>
                    {text}
                </div>
        </Common>
    );
};

export default Footer;