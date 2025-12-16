import HorseMemoApp from "@/components/HorseMemoApp";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ horseId: string }>;
};

export default async function HorsePage({ params }: Props) {
  const { horseId } = await params;

  const id = Number(horseId);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  return <HorseMemoApp selectedHorseId={id} />;
}
