import { forwardRef } from "react";
import {
  Button,
  Group,
  MultiSelect,
  SegmentedControl,
  Space,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";

enum Genus {
  ACER = "Acer",
  PRUNUS = "Prunus",
  CRATAEGUS = "Crataegus",
  MALUS = "Malus",
  QUERCUS = "Quercus",
  FRAXINUS = "Fraxinus",
  PYRUS = "Pyrus",
  TILIA = "Tilia",
  CORNUS = "Cornus",
  LIQUIDAMBAR = "Liquidambar",
  BETULA = "Betula",
  AMELANCHIER = "Amelanchier",
  CARPNIUS = "Carpnius",
  ULMUS = "Ulmus",
  PLATANUS = "Platanus",
}

const genusOptions = [
  { label: Genus.ACER, value: Genus.ACER, description: "Maple" },
  { label: Genus.PRUNUS, value: Genus.PRUNUS, description: "Cherry/Plum" },
  { label: Genus.CRATAEGUS, value: Genus.CRATAEGUS, description: "Hawthorn" },
  { label: Genus.MALUS, value: Genus.MALUS, description: "Apple" },
  { label: Genus.QUERCUS, value: Genus.QUERCUS, description: "Oak" },
  { label: Genus.FRAXINUS, value: Genus.FRAXINUS, description: "Ash" },
  { label: Genus.PYRUS, value: Genus.PYRUS, description: "Pear" },
  { label: Genus.TILIA, value: Genus.TILIA, description: "Linden" },
  { label: Genus.CORNUS, value: Genus.CORNUS, description: "Dogwood" },
  {
    label: Genus.LIQUIDAMBAR,
    value: Genus.LIQUIDAMBAR,
    description: "Sweetgum",
  },
  { label: Genus.BETULA, value: Genus.BETULA, description: "Birch" },
  {
    label: Genus.AMELANCHIER,
    value: Genus.AMELANCHIER,
    description: "Serviceberry",
  },
  { label: Genus.CARPNIUS, value: Genus.CARPNIUS, description: "Hornbeam" },
  { label: Genus.ULMUS, value: Genus.ULMUS, description: "Elm" },
  { label: Genus.PLATANUS, value: Genus.PLATANUS, description: "Sycamore" },
];

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  value: string;
  description?: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, description, ...rest }: ItemProps, ref) => (
    <div ref={ref} {...rest}>
      <Text>{label}</Text>
      {description && (
        <Text size="xs" color="dimmed">
          {description}
        </Text>
      )}
    </div>
  )
);

export default function Filters() {
  const theme = useMantineTheme();

  return (
    <>
      <MultiSelect
        data={genusOptions}
        defaultValue={Object.values(Genus)}
        itemComponent={SelectItem}
        label="Genuses"
        placeholder="Select genuses to filter on"
        searchable
        styles={{ label: { color: theme.colors.dark[5] } }}
      />
      <Space h="md" />
      <Text fz="sm" fw={500} color="dark.5">
        Ownership
      </Text>
      <SegmentedControl
        data={["All", "SDOT", "Private"]}
        defaultValue="All"
        fullWidth
      />
      <Space h="md" />
      <SimpleGrid cols={2} spacing="sm">
        <Button variant="outline">Reset</Button>
        <Button>Update</Button>
      </SimpleGrid>
    </>
  );
}
