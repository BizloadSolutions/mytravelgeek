
export default function Modal() {
    return (
        <dialog id="forgot_password_modal" className="modal">
            <div className="modal-box p-0 bg-transparent shadow-none max-w-md rounded-none">
                <div className="w-full max-w-md mx-auto bg-white p-4 sm:p-5">
                    <div className="flex flex-col">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-950">
                                    Forgot Password
                                </h2>

                                <form method="dialog">
                                    <button className="w-7 h-7 flex items-center text-xs justify-center rounded-full border border-slate-200 hover:bg-slate-100 transition">
                                        ✕
                                    </button>
                                </form>
                            </div>

                            <p className="text-sm text-slate-500">
                                Enter the registered email
                            </p>
                        </div>

                        <div className="flex flex-col gap-5 mt-6">
                            <div className="flex">
                                <input type="email" placeholder="Enter email" className="form-control" />
                            </div>

                            <button className="btn btn-primary">
                                Next
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}