import { useState } from "react"
import { View, Text } from "react-native"

import * as FileSystem from "expo-file-system"

import { styles } from "./styles"
import { Button } from "../../components/Button"

export function Download() {
  const [downloadProgressPercentage, setDownloadProgressPercentage] =
    useState(0)

  function onDownloadProgress({
    totalBytesWritten,
    totalBytesExpectedToWrite,
  }: FileSystem.DownloadProgressData) {
    const progress = (totalBytesWritten / totalBytesExpectedToWrite) * 100
    setDownloadProgressPercentage(progress)
  }

  async function handleDownload() {
    const pdfUri = "https://www.thecampusqdl.com/uploads/files/pdf_sample_2.pdf"
    const pdfFileName = "doc.pdf"

    const fileUri = FileSystem.documentDirectory + pdfFileName
    const downloadResumable = FileSystem.createDownloadResumable(
      pdfUri,
      fileUri,
      {},
      onDownloadProgress
    )

    try {
      const downloadResponse = await downloadResumable.downloadAsync()
      if (downloadResponse?.uri) {
        console.log("Download concluído para ", downloadResponse.uri)
        setDownloadProgressPercentage(0)
      }
    } catch (error) {
      console.error("Erro ao fazer download do PDF:", error)
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Download PDF" onPress={handleDownload} />
      <Text style={styles.progress}>
        Progresso: {downloadProgressPercentage}%
      </Text>
    </View>
  )
}
