import { makeAutoObservable } from "mobx";
import { router } from "../../routes";
import { BackendServiceFactory, ResponseResultEnum } from "../../services";
import { InteractFactory } from "../../services";
import { globalStore } from "../../store";

export interface LoginForm {
  uid: string;
  password: string;
}

export class LoginService {
  constructor() {
    makeAutoObservable(this);
  }
  get hasLoggedIn() {
    return !!globalStore.user.userName;
  }
  isLogin = true;

  async handleSubmit(form: LoginForm) {
    if (this.isLogin) {
      await this.handleLogin(form);
    } else {
      await this.handleRegister(form);
    }
  }

  private async handleRegister(form: LoginForm) {
    const result = await BackendServiceFactory.getPersionManageService().register(
      form
    );
    if (result.state === ResponseResultEnum.Success) {
      InteractFactory.getMessager().success(result.detail ?? "注册成功");
    } else {
      InteractFactory.getMessager().fail(result.detail ?? "注册失败");
    }
  }

  private async handleLogin(form: LoginForm) {
    const result = await BackendServiceFactory.getPersionManageService().login(
      form
    );
    if (result.state === ResponseResultEnum.Success) {
      InteractFactory.getMessager().success(result.detail ?? "登录成功");
      router.push("/home");
    } else {
      InteractFactory.getMessager().fail(result.detail ?? "登录失败");
    }
  }

  handleChangeFormType() {
    this.isLogin = !this.isLogin;
  }
}
