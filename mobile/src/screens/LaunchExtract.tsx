import { useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { VStack, Icon, useToast, HStack } from "native-base";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Switch } from "../components/Switch";
import { Button } from "../components/Button";

import { api } from "../services/api";
import { Fontisto } from "@expo/vector-icons";

import moment from "moment";
import { useAuth } from "../hooks/useAuth";

export function LaunchExtract() {
  const [value, setValue] = useState<string>(null);
  const [day, setDay] = useState<string>(Number(moment.utc().subtract(3, "hours").format("DD")).toFixed(0));
  const [month, setMonth] = useState<string>(Number(moment.utc().subtract(3, "hours").format("MM")).toFixed(0));
  const [year, setYear] = useState<string>(moment.utc().subtract(3, "hours").format("YYYY"));
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [observation, setObservation] = useState(null);
  const [typeExtract, setTypeExtract] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const { navigate } = useNavigation();
  const { userPreferences } = useAuth();

  async function fetchCategories() {
    try {
      const categories = await api.get("/categories/");
      setCategories(categories.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchAccounts() {
    try {
      const accounts = await api.get("/accounts/");
      setAccounts(accounts.data);

      if(accounts.data.length === 1) {
        setAccountId(accounts.data[0].id);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      fetchAccounts();
    }, [])
  );

  async function launchExtractApi(){
    if(
      value === null || 
      day === null || day === "" ||
      month === null || month === "" ||
      year === null || year === "" ||
      !accountId ||
      !categoryId
    ) {
      return toast.show({
        title: "Informe os dados do extrato!",
        placement: "top",
        bgColor: "red.500"
      });
    }

    try {
      setIsLoading(true);

      await api.post("/movements/", {
        value: (typeExtract ? 1 : -1) * Number(value.replace(/\D/g, ""))/100, 
        accountId,
        categoryId,
        observation: observation || undefined,
        date: moment.utc(`${day}/${month}/${year}`, "DD/MM/YYYY").toISOString()
      });

      toast.show({
        title: "Extrato criado com sucesso!",
        placement: "top",
        bgColor: "green.500"
      });

      setTypeExtract(false);
      setValue(null);
      setDay(Number(moment.utc().subtract(3, "hours").format("DD")).toFixed(0));
      setMonth(Number(moment.utc().subtract(3, "hours").format("MM")).toFixed(0));
      setYear(moment.utc().subtract(3, "hours").format("YYYY"));
      setObservation(null);
      if(accounts.length === 1) {
        setAccountId(accounts[0].id);
      } else {
        setAccountId("");
      }
      setCategoryId("");

      navigate("extract");
    } catch(err) {
      console.log(err);
      toast.show({
          title: "Não foi possível criar o extrato",
          placement: "top",
          bgColor: "red.500"
      }); 
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor={userPreferences.theme === "DARK" ? "gray.800" : "indigo.200"}>
      <Header
        title="Lançar extrato"
        key={"launchExtract"}
        backButtonNavigate="extract"
      />
      <VStack flex={1} p={7}>
        <VStack flex={1} alignItems="center" justifyContent="flex-start">
          <Switch 
            onTrackLabel="Renda"
            offTrackLabel="Gasto"
            value={typeExtract}
            onValueChange={(value) => {setTypeExtract(value)}}
          />
          <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
          >
            <VStack w="1/4">
              <Select 
                label="Dia"
                placeholder="Selecione o dia"
                selectedValue={day}
                onValueChange={itemValue => setDay(itemValue)}
                data={
                  Array.from({length: moment.utc(`${year}-${month}`, "YYYY-MM").daysInMonth()}, (_, i) => i + 1).map(e => {
                    return {
                      id: e.toFixed(0),
                      label: e.toFixed(0)
                    };
                  })
                }
              />
            </VStack>
            <VStack w="1/4">
              <Select 
                label="Mês"
                placeholder="Selecione o mês"
                selectedValue={month}
                onValueChange={itemValue => setMonth(itemValue)}
                data={
                  Array.from({length: 12}, (_, i) => i + 1).map(e => {
                    return {
                      id: e.toFixed(0),
                      label: e.toFixed(0)
                    };
                  })
                }
              />
            </VStack>
            
            <VStack w="1/3">
              <Select 
                label="Ano"
                placeholder="Selecione o ano"
                selectedValue={year}
                onValueChange={itemValue => setYear(itemValue)}
                data={
                  Array.from({length: 2}, (_, i) => i + 1).map(e => {
                    return {
                      id: (Number(moment.utc().subtract(3, "hours").format("YYYY")) - e + 1).toFixed(0),
                      label: (Number(moment.utc().subtract(3, "hours").format("YYYY")) - e + 1).toFixed(0)
                    };
                  })
                }
              />
            </VStack>
          </HStack>
          <Input
            label="Valor (R$)"
            placeholder="Ex: 25,32"
            typeInput="VALUE"
            value={value}
            setValue={setValue}
          />
          <Select
            label="Conta"
            placeholder="Selecione sua conta"
            selectedValue={accountId}
            onValueChange={itemValue => setAccountId(itemValue)}
            data={accounts.map((account) => ({
              id: account.id,
              label: account.name,
            }))}
          />
          <Select
            label="Categoria"
            placeholder="Selecione a categoria"
            selectedValue={categoryId}
            onValueChange={itemValue => setCategoryId(itemValue)}
            data={categories
              .filter((category) => category.type === "CATEGORY")
              .map((category) => ({ id: category.id, label: category.name }))}
          />
          <Input
            label="Observações"
            placeholder="Ex: Pagamento conta de luz"
            typeInput="TEXT"
            value={observation}
            setValue={setObservation}
          />
        </VStack>
        <Button 
          title="Lançar extrato"
          leftIcon={<Icon as={Fontisto} name="plus-a" color={userPreferences.theme === "DARK" ? "gray.900" : "indigo.200"} size="md" />}
          onPress={launchExtractApi}
          isLoading={isLoading}
        />
      </VStack>
    </VStack>
  );
}
