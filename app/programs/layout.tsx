import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import SideNav from '@/app/ui/programs/sidenav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                    <div className="w-full flex-none md:w-64 md:p-0">
                        <SideNav />
                    </div>
                    <div className="flex-grow p-0 md:overflow-y-auto md:p-1">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}
