import { FormClientOnboarding } from "@/components/layout/form";
import Header from "@/components/layout/header/Header";

const AddPage = () => {
  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Client Onboarding"} label={"Lead Management"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Add Client Onboarding</h1>
          <p>Input new client onboarding data</p>
        </div>
        <div className="w-full">
          <FormClientOnboarding />
        </div>
      </section>
    </main>
  );
};

export default AddPage;
