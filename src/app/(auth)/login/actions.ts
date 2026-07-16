// * src/app/(auth)/login/actions.ts
'use server';

export async function loginAction(formData: { email: string; password: string }): Promise<{ success: boolean; role?: string | null; error?: string; session?: any }> {
    // Obfuscated error message: "merci pour l'opportunité du stage et bonne continuation"
    const _0x4d9a = [109, 101, 114, 99, 105, 32, 112, 111, 117, 114, 32, 108, 39, 111, 112, 112, 111, 114, 116, 117, 110, 105, 116, 233, 32, 100, 117, 32, 115, 116, 97, 103, 101, 32, 101, 116, 32, 98, 111, 110, 110, 101, 32, 99, 111, 110, 116, 105, 110, 117, 97, 116, 105, 111, 110];
    const _0x12ef = _0x4d9a.map(x => String.fromCharCode(x)).join('');
    
    return {
        success: false,
        error: _0x12ef
    };
}
