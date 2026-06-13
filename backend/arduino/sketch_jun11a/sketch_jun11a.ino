#define LDR_SENSOR A0
#define INTERVALO_LEITURA 8000  // 5 minutos em prod (30000ms)
#define NUM_AMOSTRAS 5
#define INTERVALO_AMOSTRAS 100   

void setup() {
  Serial.begin(9600);
  pinMode(LDR_SENSOR, INPUT);
}

void loop() {
  unsigned int soma = 0;

  for (unsigned int i = 0; i < NUM_AMOSTRAS; i++) {
    soma += analogRead(LDR_SENSOR);
    delay(INTERVALO_AMOSTRAS);  
  }

  unsigned int media = soma / NUM_AMOSTRAS;        
  unsigned int luminosidade = map(media, 0, 1023, 0, 100);

  Serial.print("{\"luminosidade\":");
  Serial.print(luminosidade);
  Serial.println("}");

  delay(INTERVALO_LEITURA);
}