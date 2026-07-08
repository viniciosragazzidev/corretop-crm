import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
    className?: string;
}

const Logo: React.FC<Props> = ({ className = '' }) => {
    return (
        <Link
            href="/"
            className={`font-logo text-3xl font-extrabold tracking-wide flex items-center gap-1 text-[#1a68db] transition-opacity hover:opacity-90 ${className}`}
            style={{ fontFamily: "var(--font-logo), 'Amil Typeface', sans-serif" }}
        >
            <Image src="/icon-logo.png" alt="Logo" width={30} height={30} /> venacor
        </Link>
    );
};

export default Logo;