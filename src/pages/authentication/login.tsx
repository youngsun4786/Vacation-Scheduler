import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validations/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../feature/Navbar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LogIn } from "@/firebase/firebase.service";
import MyAlert, { MsgTypes, AlertMessages } from "@/feature/MyAlert";

export const Login = () => {
  const [formPage] = useState<number>(0);
  const [alertMsg, setAlertMsg] = useState<MsgTypes>("success");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const navigate = useNavigate();

  type LoginInput = z.infer<typeof loginSchema>;
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const LogInAction = async (
    data: LoginInput,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    setShowAlert(true);

    try {
      const userCredential = await LogIn(data.email, data.password);
      console.log(userCredential.user);
      // navigate back to main page
      navigate("/", { replace: true });
    } catch (error) {
      setAlertMsg("error");
      // console.log(error.message);
      // alert(error.message);
    }
  };

  return (
    <div className="flex w-full">
      <Navbar />
      <div className="h-screen border-r"></div>
      <div className="flex w-full justify-center">
        <Card className="h-2/5 w-1/3 m-auto">
          <CardHeader className="items-center pb-4">
            <CardTitle className="mb-1">Log In</CardTitle>
            <CardDescription>
              Continue the journey with us here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(LogInAction)}
                className="space-y-3"
              >
                <motion.div
                  className={cn("space-y-3 ", {
                    hidden: formPage === 1,
                  })}
                  animate={{ translateX: `-${formPage * 100}%` }}
                  transition={{ ease: "easeInOut" }}
                >
                  {/* email  */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...form.register("email")}
                            placeholder="Enter your email..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Password</FormLabel>
                        <FormControl>
                          <Input
                            {...form.register("password")}
                            autoComplete="off"
                            {...field}
                            placeholder="Password"
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <div className="flex mt-2 mr-1 justify-end">
                  <p className="flex text-xs gap-x-2">
                    You don't have an account?{" "}
                    <Link className="flex text-xs underline" to="/signup">
                      Sign Up
                    </Link>
                  </p>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    className={cn({ hidden: formPage === 1 })}
                    type="submit"
                    onClick={() => {
                      // validating before logging in
                      form.trigger(["email", "password"]);
                      const emailState = form.getFieldState("email");
                      const passwordState = form.getFieldState("password");
                      if (!emailState.isDirty || emailState.invalid) return;
                      if (!passwordState.isDirty || passwordState.invalid)
                        return;
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      {showAlert && (
        <MyAlert
          message={AlertMessages[alertMsg].message}
          alertTitle={AlertMessages[alertMsg].alertTitle}
          type={AlertMessages[alertMsg].type as MsgTypes}
        ></MyAlert>
      )}
    </div>
  );
};
