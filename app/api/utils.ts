export async function createResponse(message: string | object, status: number) {
  return new Response(JSON.stringify(message), { status });
}
