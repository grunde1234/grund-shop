"use client"
import { useState } from "react"
import { toast } from 'sonner'
import { useForm, SubmitHandler } from "react-hook-form"
import { insertReviewSchema } from "@/lib/validators"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { reviewFormDefaultValues } from "@/lib/constants"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StarIcon } from "lucide-react"
import { createUpdateReview } from "@/lib/actions/review.actions"


type props = {
    userId: string,
    productId: string,
    onReviewSubmitted: () => void
}
const ReviewForm = ({userId, productId, onReviewSubmitted}: props) => {

 const [open, setOpen] = useState(false);

 /*  */
 const form = useForm<z.input<typeof insertReviewSchema>, unknown, z.output<typeof insertReviewSchema>>({
 resolver: zodResolver(insertReviewSchema),
 defaultValues: reviewFormDefaultValues
 });


 /* OPEN FORM ACTION */
 const handleOpenForm = () =>{
  form.setValue('productId', productId);
  form.setValue('userId', userId)
  setOpen(true)
 };

/* SUBMIT FORM ACTION */
 const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async(values) =>{
  const res = await createUpdateReview({...values, productId});
  
  if (!res.success) {
      toast.error(res.message);
      return;
    }

    setOpen(false);

    onReviewSubmitted();

    toast.success(res.message)
 }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant='default' onClick={handleOpenForm}>
        Write a review
      </Button>
      <DialogContent className='sm:max-w-[425px]'>
        <Form {...form}>
          <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                Write a review
              </DialogTitle>
              <DialogDescription>
                Share your thoughts with other customers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* TITLE */}
              <FormField
              control={form.control}
              name="title"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                  <Input placeholder='Enter title' {...field} />
                  </FormControl>
                </FormItem>
              )} />
              {/* COMMENT */}
              <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                  <Textarea placeholder='Enter description' {...field} />
                  </FormControl>
                </FormItem>
              )} />
              {/* RATING */}
              <FormField
              control={form.control}
              name="rating"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                 <Select onValueChange={field.onChange} value={field.value ? field.value.toString() : undefined}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder='Select a rating from 1 to 5 stars'>
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({length: 5}).map((_, index)=>(
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {index + 1} <StarIcon className="inline h-4 w-4"/>
                      </SelectItem>
                    ))}
                  </SelectContent>
                 </Select>
                 <FormMessage />
                </FormItem>
              )} />
            </div>
            <DialogFooter>
              <Button type="submit" size='lg' className='w-full' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  )
}

export default ReviewForm