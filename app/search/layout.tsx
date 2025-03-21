"use client";
import '@/app/ui/global.css';
// import NewHeader from '@/components/NewHeader';




export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="cn">
            <body>
                {/* <NewHeader /> */}
                {children}

            </body>
        </html>
    )
}
