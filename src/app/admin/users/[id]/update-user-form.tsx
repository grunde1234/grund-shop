"use client";

import { updateUserSchema } from "@/lib/validators";
import { useRouter } from "next/navigation";
import z from "zod";
import { toast } from "sonner";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USER_ROLES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/actions/user.actions";

const UpdateUserForm = ({
  user,
}: {
  user: z.infer<typeof updateUserSchema>;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    mode: "onBlur",
    resolver: zodResolver(updateUserSchema),
    defaultValues: user ?? {'email': '', 'name': '', 'role': ''} /* user is an object passed from page.tsx */,
  });

  const onSubmit:SubmitHandler<z.infer<typeof updateUserSchema>> = async(data) => {
    const result = await updateUser({...data, id: user.id});
    if (result.success) {
      toast.success(result.message);
      router.push("/admin/users");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div>
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Email */}
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                "email"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="User email" disabled={true} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Name */}
        <div>
         <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                "name"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="User name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Role */}
        <div>
         <FormField
            control={form.control}
            name="role"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                "role"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value.toString()}>
                <FormControl>
                <SelectTrigger className="w-full">
                <SelectValue placeholder='Select a role'/>
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
                </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> 
        <div className="flex-between mt-4">
          <Button type="submit" className="btn cursor-pointer w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isLoading ? "Updating..." : "Update User"}
          </Button>
        </div>
      </form>
    </Form>
  </div>);
}


export default UpdateUserForm;
