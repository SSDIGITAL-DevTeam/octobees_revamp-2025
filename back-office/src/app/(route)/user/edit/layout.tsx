import { Suspense } from "react";
import EditPage from "./page";

const EditPageWrapper = () => {
  return (
    <Suspense fallback={<div></div>}>
      <EditPage />
    </Suspense>
  );
};

export default EditPageWrapper;
