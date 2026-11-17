// Configurações do Cloudinary — substitua com os seus dados
// Cloud name: encontrado no Dashboard do Cloudinary
// Upload preset: Settings > Upload > Upload presets > Add unsigned preset
const CLOUD_NAME = 'uwif0sqc'
const UPLOAD_PRESET = 'prisma_unsigned'

/**
 * Faz upload de um arquivo para o Cloudinary via unsigned upload.
 * @param {File} file - Arquivo de imagem
 * @param {(progress: number) => void} onProgress - Callback de progresso (0-100)
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadToCloudinary(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'prisma-figures')

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText)
        resolve({ url: data.secure_url, publicId: data.public_id })
      } else {
        reject(new Error('Falha no upload'))
      }
    }

    xhr.onerror = () => reject(new Error('Erro de rede'))
    xhr.send(formData)
  })
}

/**
 * Deleta uma imagem do Cloudinary via API (requer backend ou Cloud Function).
 * Como estamos em frontend estático, apenas removemos do Firestore.
 * Para deletar do Cloudinary, configure um webhook ou use o painel deles.
 */
export function getCloudinaryThumb(url, width = 400) {
  if (!url || !url.includes('cloudinary.com')) return url
  // Insere transformação de resize na URL do Cloudinary
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`)
}
