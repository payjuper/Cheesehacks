import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 환경 변수 가져오기
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req: Request) => {
  try {
    const { record, table, type } = await req.json();

    // Supabase 클라이언트 생성
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // 테스트용 수신 이메일 (반드시 Resend 가입 시 사용한 본인 메일로 수정하세요!)
    let targetEmail = "jackleaper1121@proton.me";
    let subject = "[UW Matching] 알림";
    let htmlContent = "";

    // [수정 포인트 1] projects 테이블에 새 글이 올라왔을 때의 로직 추가
    if (table === "projects" && type === "INSERT") {
      subject = `[새 프로젝트] ${record.title}`;
      htmlContent = `
        <h2>새로운 프로젝트가 등록되었습니다!</h2>
        <p><strong>제목:</strong> ${record.title}</p>
        <p><strong>내용:</strong> ${record.content}</p>
        <p>UW-Madison Cheesehacks 대시보드에서 확인하세요.</p>
      `;
    }
    // 기존 댓글 로직
    else if (table === "comments" && type === "INSERT") {
      const { data: postData } = await supabase
        .from("projects")
        .select("title")
        .eq("id", record.post_id)
        .single();

      subject = `[댓글 알림] '${postData?.title || "게시글"}'에 댓글이 달렸습니다.`;
      htmlContent = `<p><strong>댓글 내용:</strong> ${record.content}</p>`;
    }

    // [수정 포인트 2] 이메일 내용이 있을 때만 Resend 호출
    if (!htmlContent) {
      return new Response(
        JSON.stringify({
          message: "No email content generated for this event.",
        }),
        { status: 200 },
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        // [수정 포인트 3] 무료 플랜에서 가장 안전한 발신자 형식
        from: "onboarding@resend.dev",
        to: [targetEmail],
        subject: subject,
        html: htmlContent,
      }),
    });

    const responseData = await res.json();
    return new Response(JSON.stringify(responseData), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
