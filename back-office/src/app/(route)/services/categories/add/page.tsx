import { FormCategory } from "@/components/layout/form";
import Header from "@/components/layout/header/Header";

const AddPage = () => {
  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Category"} label={"Service Management"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Add Category</h1>
          <p>Input new category data</p>
        </div>
        <div className="w-full">
          <FormCategory />
        </div>
      </section>
    </main>
  );
};

export default AddPage;
