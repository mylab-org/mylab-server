export function getEmailVerificationTemplate(name: string, verifyUrl: string) {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="utf-8">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        
        <!-- 헤더 -->
        <div style="background: linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%); padding: 40px 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">MyLab</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px;">연구실 관리 플랫폼</p>
        </div>
        
        <!-- 본문 -->
        <div style="padding: 40px 32px;">
          <h2 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 22px; font-weight: 600;">
            교수 이메일 인증
          </h2>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 8px 0;">
            안녕하세요, <strong>${name}</strong> 교수님!
          </p>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
            MyLab 서비스 이용을 위한 교수 이메일 인증을 완료해주세요.<br>
            아래 버튼을 클릭하면 인증이 완료됩니다.
          </p>
          
          <!-- 인증 버튼 -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="
              display: inline-block;
              padding: 16px 48px;
              background: linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%);
              color: #ffffff;
              text-decoration: none;
              font-size: 16px;
              font-weight: 600;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
            ">이메일 인증하기</a>
          </div>
          
          <!-- 안내 문구 -->
          <div style="background-color: #f0f9ff; border-radius: 8px; padding: 16px; margin-top: 32px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">
              ⏰ 이 링크는 <strong>24시간</strong> 후 만료됩니다.<br>
              🔒 본인이 요청하지 않았다면 이 메일을 무시해주세요.
            </p>
          </div>
          
          <!-- 링크 직접 복사 -->
          <div style="margin-top: 24px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0;">
              버튼이 작동하지 않으면 아래 링크를 복사해서 브라우저에 붙여넣기 해주세요:
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 0; word-break: break-all;">
              ${verifyUrl}
            </p>
          </div>
        </div>
        
        <!-- 푸터 -->
        <div style="background-color: #f8f9fa; padding: 24px 32px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © 2024 MyLab. All rights reserved.
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
}
