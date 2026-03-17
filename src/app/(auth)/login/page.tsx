"use client";

import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex w-full h-screen mx-auto items-center justify-center">
      <Card className="w-full max-w-100">
        <CardHeader>
          <CardTitle>Faça o login</CardTitle>
          <CardDescription>
            Insira suas credenciais nos campos abaixo.
          </CardDescription>
        </CardHeader>
        <LoginForm />
      </Card>
    </div>
  );
}
