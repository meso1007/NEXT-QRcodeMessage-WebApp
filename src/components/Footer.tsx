"use client"
import { useRouter } from "next/navigation";

export default function Footer() {
    const router = useRouter()

    const toProfile = () => {
        router.push("/about#profile")
    }
    return (
        <footer className="py-12 px-4 text-center text-gray-400 bg-transparent">
            <p className="mb-6 text-lg">
                このサービスは非営利目的で運営されています。<br />
                すべての機能を無料でご利用いただけます。
            </p>
            <div className="flex justify-center gap-8 text-sm flex-wrap">
                <a href="/terms" className="hover:text-rose-400 transition-colors duration-300 hover:underline">利用規約</a>
                <a href="/privacy" className="hover:text-rose-400 transition-colors duration-300 hover:underline">プライバシーポリシー</a>
                <a href="/faq" className="hover:text-rose-400 transition-colors duration-300 hover:underline">よくある質問</a>
                {/* 一時的に寄付機能を無効化（ユーザーが増えるまで） */}
                {/* <a href="/donate" className="hover:text-rose-400 transition-colors duration-300 hover:underline">寄付について</a> */}
            </div>
            <div className="mt-8 pt-8 border-t border-pink-100">
                <p className="text-sm">© 2025 Otodoke Life. Made with <span className="cursor-pointer hover:underline hover:text-blue-400" onClick={toProfile}>Mirai Message Association</span></p>
            </div>
        </footer>
    );
}