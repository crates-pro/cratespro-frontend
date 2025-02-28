import '@/app/ui/global.css';
import { SessionProvider } from "next-auth/react"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="cn">
            <body>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </body>
        </html>
    )
}
