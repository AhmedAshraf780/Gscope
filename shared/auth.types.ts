/*
 * 
 *  REQUESTS
 * */

export type createUserRequest = {
  username: string;
  password: string;
  email: string;
  phone: string;
};

export type loginRequest = {
  email: string;
  password: string;
};


export type validateOtpRequest = {
  otp: string;
  session: string;
};

export type forgotPasswordRequest = {
  email: string;
};

export type restorePasswordRequest = {
  password: string;
  confirmPassword: string;
  session: string;
};


/*
 *
 *  RESPONSES
 * */
export type createUserResponse = {
  ok: boolean;
  message: string;
  session?: string;
};

export type sendOtpResponse = {
  ok: boolean;
  message: string;
  session?: string;
  forgotPassword?: boolean;
};

export type signInResponse = {
  ok: boolean;
  message?: string;
  userId?: number;
  username?: string;
  email?: string;
};

export type forgotPasswordResponse = {
  ok: boolean;
  message: string;
  session?: string;
};

export type restorePasswordResponse = {
  ok: boolean;
  message: string;
};

export type validateOtpResponse = {
  ok: boolean;
  message: string;
  forgotPassword?: boolean;
  session?: string;
};


