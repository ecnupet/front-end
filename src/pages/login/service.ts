import { FormInstance } from "antd";
import { makeAutoObservable } from "mobx";

export interface LoginForm {
  uid: string;
  password: string;
}

export class LoginService {
  constructor() {
    makeAutoObservable(this);
  }

  formInstance!: FormInstance<LoginForm>;

  getDefaultLoginForm(): LoginForm {
    return {
      uid: "999",
      password: "123456",
    };
  }

  useForm(formInstance: FormInstance<LoginForm>) {
    this.formInstance = formInstance;
  }

  onSubmit(form: LoginForm) {
    console.log(this);
    //   console.log(this.formInstance.getFieldsValue());
    console.log(form);
  }
}
