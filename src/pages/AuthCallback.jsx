import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check if profile already exists
        const { data: existing } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        // Only create if it doesn't exist yet
        if (!existing) {
          await supabase.from("profiles").insert([{
            id: user.id,
            school_email: user.email,
          }]);
        }
      }

      navigate("/");
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif', color: '#999' }}>
      Signing you in...
    </div>
  );
}