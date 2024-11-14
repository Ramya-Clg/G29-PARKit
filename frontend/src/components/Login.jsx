import '../App';
export const Login = () => {
  return (
    <section className="flex items-center justify-center min-h-screen bg-[#CBE4DE]">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-10 rounded-lg shadow-lg w-full max-w-md border border-white/20">
        <div className="form-value">
          <form action="">
            <h2 className="text-[#2C3333] text-center mb-6 text-2xl font-semibold">
              Login
            </h2>

            <div className="relative mb-6">
              <ion-icon
                name="mail-outline"
                className="absolute left-0 top-1/2  transform -translate-y-[80%] text-[#0E8388]"
              ></ion-icon>
              <input
                type="email"
                required
                className="w-full pl-8 pb-1 bg-transparent border-b border-[#0E8388] text-[#CBE4DE] focus:outline-none focus:border-[#2E4F4F] transition-all duration-300"
              />
              <label className="absolute left-8 top-1/2 transform -translate-y-[65%] text-black opacity-50 pointer-events-none transition-all duration-300">
                Email
              </label>
            </div>

            <div className="relative pt-1 mb-6">
              <ion-icon
                name="lock-closed-outline"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 text-[#0E8388]"
              ></ion-icon>
              <input
                type="password"
                required
                className="w-full pl-8 pb-1 bg-transparent border-b border-[#0E8388] text-[#CBE4DE] focus:outline-none focus:border-[#2E4F4F] transition-all duration-300"
              />
              <label className="absolute left-8 top-1/2 transform -translate-y-[57%] text-black opacity-50 pointer-events-none transition-all duration-300">
                Password
              </label>
            </div>

            <div className="flex justify-between items-center mb-6 text-[#CBE4DE]">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Remember me</span>
              </label>
              <label>
                <a href="#" className="text-[#0E8388] hover:underline">
                  Forgot password?
                </a>
              </label>
            </div>

            <button className="w-full py-2 bg-[#0E8388] text-[#CBE4DE] font-bold rounded-md transition duration-300 hover:bg-[#2E4F4F]">
              Log in
            </button>

            <div className="text-center mt-6">
              <p className="text-[#CBE4DE]">
                Don't have an account?{" "}
                <a href="#" className="text-[#0E8388] font-bold hover:underline">
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
