import "../styles/globals.css";
import PageContainer from "@/components/PageContainer";

export const metadata = {
  title: "Burrito Intentions",
  description: "A simple app to track your intentions and goals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PageContainer>{children}</PageContainer>
      </body>
    </html>
  );
}
