
import { trpc } from "~/trpc/client";

export const useSignup = () => {
    const { mutateAsync: createUserWithEmailAndPasswordAsync, mutate:createUserWithEmailAndPassword,error,isError,failureCount,isSuccess,isPending,isIdle,status } = trpc.auth.createUserWithEmailAndPassword.useMutation()
    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        isError,
        error,
        failureCount,
        isSuccess,
        isPending,
        isIdle,
        status
    }
}