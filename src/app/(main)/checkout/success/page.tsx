import CheckoutSuccessView, { type BankDetail } from "@/components/CheckoutSuccessView";

interface SuccessSearchParams {
  Response?: string | string[];
  AuthCode?: string | string[];
  ProcReturnCode?: string | string[];
  OrderID?: string | string[];
  [key: string]: string | string[] | undefined;
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SuccessSearchParams>;
}) {
  const params = await searchParams;

  const bankDetails: BankDetail[] = (
    [
      { key: "Response", raw: params.Response },
      { key: "Auth Code", raw: params.AuthCode },
      { key: "Return Code", raw: params.ProcReturnCode },
      { key: "Order ID", raw: params.OrderID },
    ] as const
  )
    .map(({ key, raw }) => ({ key, value: firstValue(raw) }))
    .filter((detail): detail is BankDetail => Boolean(detail.value));

  const orderId = firstValue(params.OrderID);

  return <CheckoutSuccessView bankDetails={bankDetails} orderId={orderId} />;
}
