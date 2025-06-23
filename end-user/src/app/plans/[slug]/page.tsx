import { JSX} from "react";
import { notFound, useParams } from "next/navigation";
import HeaderComponents from "@/app/plans/_components/HeaderComponents";
import PlanComponents from "@/app/plans/_components/PlanComponents";
import { CategoryService } from "@/constants/payload";
import { getCategoryBySlug } from "@/services/plan.services";

type Props = {
  params: {
    slug: string
  }
}

export default async function Page({ params }: Props): Promise<JSX.Element> {
  let category: CategoryService | null = null
  try {
    category = await getCategoryBySlug(params.slug);
  } catch (error) {
    return notFound();
  }

  return (
    <>
      <main className="w-full">
        <HeaderComponents
          plans={category.name}
          desc={category.description}
          title={category.heading}
        />
        <section className="flex flex-col overflow-x-auto py-[10px] xl:py-[20px]">
          <div className="container">
            <PlanComponents data={category.plans}/>
          </div>
        </section>
      </main>
    </>
  );
}

