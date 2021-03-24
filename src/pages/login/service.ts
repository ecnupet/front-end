import { makeAutoObservable } from "mobx";
import { router } from "../../route";

export interface LoginForm {
  uid: string;
  password: string;
}

export class LoginService {
  constructor() {
    makeAutoObservable(this);
  }

  isLogin = true;

  handleSubmit(form: LoginForm) {
    // TODO
    router.push("/developing");
    console.log(form);
  }

  handleChangeFormType() {
    this.isLogin = !this.isLogin;
  }
}
