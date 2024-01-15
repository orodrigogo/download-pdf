import { View } from "react-native"

import { styles } from "./styles"
import { Button } from "../../components/Button"

export function Download() {
  return (
    <View style={styles.container}>
      <Button title="Download PDF" />
    </View>
  )
}
