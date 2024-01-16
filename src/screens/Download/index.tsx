import { useState } from "react"
import { View, Text, Platform, Alert } from "react-native"

import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"

import { styles } from "./styles"
import { Button } from "../../components/Button"

const PDF_NAME = "doc.pdf"
// const PDF_URI = "https://www.thecampusqdl.com/uploads/files/pdf_sample_2.pdf" // leve.
const PDF_URI = "https://www.mcfadden.com.br/assets/pdf/Flofi.pdf" // pesado

export function Download() {
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)

  function onDownloadProgress({
    totalBytesWritten,
    totalBytesExpectedToWrite,
  }: FileSystem.DownloadProgressData) {
    const percentage = (totalBytesWritten / totalBytesExpectedToWrite) * 100
    setProgressPercentage(percentage)
  }

  async function handleDownload() {
    try {
      setIsDownloading(true)

      const fileUri = FileSystem.documentDirectory + PDF_NAME

      const downloadResumable = FileSystem.createDownloadResumable(
        PDF_URI,
        fileUri,
        {},
        onDownloadProgress
      )

      const downloadResponse = await downloadResumable.downloadAsync()

      if (downloadResponse?.uri) {
        await fileSave(downloadResponse.uri, PDF_NAME)
        setProgressPercentage(0)
        setIsDownloading(false)
      }
    } catch (error) {
      Alert.alert("Download", "Não foi possível realizar o download.")
      console.error(error)
    }
  }

  async function fileSave(uri: string, filename: string) {
    if (Platform.OS === "android") {
      // Pega a pasta temporária.
      const directoryUri = FileSystem.cacheDirectory + filename

      // Lê o conteúdo do arquivo em formato base64
      const base64File = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Escreve o conteúdo do arquivo no diretório.
      await FileSystem.writeAsStringAsync(directoryUri, base64File, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Abre o arquivo recém-criado
      await Sharing.shareAsync(directoryUri)
    } else {
      Sharing.shareAsync(uri)
    }
  }

  return (
    <View style={styles.container}>
      <Button
        title="Download PDF"
        onPress={handleDownload}
        isLoading={isDownloading}
      />

      {progressPercentage > 0 && (
        <Text style={styles.progress}>
          {progressPercentage.toFixed(1)}% baixado...
        </Text>
      )}
    </View>
  )
}
