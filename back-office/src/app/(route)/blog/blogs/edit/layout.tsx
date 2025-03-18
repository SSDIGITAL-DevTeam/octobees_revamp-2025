// import { Suspense } from "react";
// import EditPage from "./page";

// const EditPageWrapper = () => {
//   return (
//     <Suspense fallback={<div></div>}>
//       <EditPage />
//     </Suspense>
//   );
// };

// export default EditPageWrapper;

import { ReactNode, Suspense } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div></div>}>{children}</Suspense>;
}
