export async function sendTelegramMessage(params: {
  token: string;
  chatId: string;
  text: string;
}): Promise<void> {
  const url = `https://api.telegram.org/bot${params.token}/sendMessage`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: params.chatId,
      text: params.text,
      disable_web_page_preview: true
    })
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Telegram sendMessage failed: ${res.status} ${body}`);
  }
}
