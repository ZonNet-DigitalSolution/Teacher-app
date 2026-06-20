import { useAppDispatch } from "@/hooks/store-hooks";
import { registerAlertGateway } from "@/services/alertGateway";
import { showAlert } from "@/store/alert";
import { useEffect } from "react";

export function useAlertGateway() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    registerAlertGateway((payload) => dispatch(showAlert(payload)));
  }, [dispatch]);
}
