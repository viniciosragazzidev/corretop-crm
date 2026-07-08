import React from 'react';
import Logo from '@/components/logo';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, WandSparkles } from '@hugeicons/core-free-icons';
import { Button } from './ui/button';

interface Props {

}

const Navbar: React.FC<Props> = ({ }) => {
    return (
        <nav className='flex w-full h-20 items-center justify-between'>
            <div className="flex gap-18 items-center">
                <Logo />
                <ul className='flex items-center gap-8 text-gray-600 text-sm'>
                    <li>
                        <Link className='transition-all duration-300 hover:underline' href="/">Nossos Planos</Link>
                    </li>
                    <li>
                        <Link className='transition-all duration-300 hover:underline' href="/sobre">Sobre</Link>
                    </li>
                    <li>
                        <Link className='transition-all duration-300 hover:underline' href="/produtos">Produtos</Link>
                    </li>

                    <li className='ml-5 text-gray-500'>
                        <HugeiconsIcon icon={Search01Icon} className='w-5 h-5 cursor-pointer' />
                    </li>
                </ul>
            </div>

            <div className="flex gap-8 items-center">
                <ul className='flex items-center gap-8 text-gray-600 text-sm'>
                    <li>
                        <Button variant="default" size="lg" className='text-[13.5px] '>
                            Cotação Rápida <span className=''>
                                <HugeiconsIcon icon={WandSparkles} />
                            </span>
                        </Button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;