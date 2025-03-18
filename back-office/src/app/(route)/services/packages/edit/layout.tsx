import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
return(
  <Suspense fallback={<div></div>}>
    {children}
  </Suspense>
)
}
// const EditPageWrapper = () => {
//   return (
//     <Suspense fallback={<div></div>}>
//       <EditPage />
//     </Suspense>
//   );
// };

// export default EditPageWrapper;
