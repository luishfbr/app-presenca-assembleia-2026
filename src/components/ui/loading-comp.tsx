import Image from "next/image";
import { Spinner } from "./spinner";
import { Button } from "./button";

export const DefaultLoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner />
    </div>
  );
};

export const DefaultLoadingComponent = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner />
    </div>
  );
};

export const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Image
        src={"/images/checkin-background.png"}
        alt="Plano de fundo tela de login."
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full z-0"
      />
      <Spinner className="w-20 h-20" />
    </div>
  );
};

export const DefaultLoadingButton = ({
  disabled,
  form,
  label,
  loading,
}: {
  disabled: boolean;
  loading: boolean;
  label: string;
  form: string;
}) => {
  return (
    <Button disabled={disabled} form={form} type="submit">
      {loading ? <Spinner /> : label}
    </Button>
  );
};

export const CustomLoadingComponent = ({
  imageSrc,
}: {
  imageSrc?: string;
}) => {
  return (
    <div className="flex w-full h-screen mx-auto justify-center items-center">
      {imageSrc ? (
        <Image
          alt="Carregando..."
          src={imageSrc}
          width={150}
          height={150}
          unoptimized
          priority
          className="object-contain animate-spin will-change-transform"
        />
      ) : (
        <Spinner className="w-20 h-20 text-white" />
      )}
    </div>
  );
};
