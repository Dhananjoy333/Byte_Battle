import React from 'react';
import { Metadata } from 'next';
import { GameHUD } from '@/app/_components/gameHUD';

export const metadata: Metadata = {
    title: 'Byte Battle - Match HUD',
    description: 'Retro arcade combat HUD for Byte Battle coding matches.',
};

export default function GameHUDPage(): React.JSX.Element {
    return <GameHUD />;
}
