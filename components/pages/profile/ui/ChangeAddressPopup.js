"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/local-ui/input";

import { updateAddressAction } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

import { ErrorMessage } from "@/components/local-ui/errorMessage";
import { SubmitBtn } from "@/components/local-ui/SubmitBtn";
import { ChangeButton } from "./ChangeButton";
import { Button } from "@/components/ui/button";

export function ChangeAddressPopup() {
  const [state, dispatch] = useFormState(updateAddressAction, null);
  const [opened, setOpened] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success === true) {
      setTimeout(() => {
        setOpened(false);
        toast({
          title: "Success",
          description: state?.message,
          variant: "default",
        });
      }, 500);
    }
    if (state?.success === false && state?.error) {
      setTimeout(() => {
        toast({
          title: "Error",
          description: state?.error?.address,
          variant: "destructive",
        });
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleSubmit = async (e) => {
    toast({
      title: "Saving",
      description: "Please wait while we save your changes",
      variant: "info",
    });
  };

  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>
        <ChangeButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change your address</DialogTitle>
          <DialogDescription>
            It is recommended not to save real address here.
          </DialogDescription>
          {state?.success === false && state?.message && (
            <ErrorMessage message={state?.message} />
          )}
        </DialogHeader>
        <form
          id="change-address-form"
          className={"flex flex-col gap-4"}
          action={dispatch}
          onSubmit={handleSubmit}
        >
          <div className="flex">
            <Input
              id="address-hsviuxwv"
              name="address"
              label="Address"
              placeholder="Enter address"
              error={state?.error?.address}
              type={"textarea"}
              className={"w-full"}
            />
          </div>
          <DialogFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Save</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    It is recommended not to save real address here.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-primary">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    asChild
                    className="bg-destructive hover:bg-destructive/80"
                  >
                    <SubmitBtn
                      type="submit"
                      customTitle={{
                        default: "Continue",
                        onSubmitting: "Saving...",
                      }}
                      formId={"change-address-form"}
                    />
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
