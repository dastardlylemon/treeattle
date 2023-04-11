import { forwardRef, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Group,
  MultiSelect,
  SegmentedControl,
  Select,
  Space,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Genus, Owner, PresetFilter } from "../types/filters";
import { useFilterContext } from "./FilterContext";

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

const presetOptions = [
  {
    label: "Popular",
    value: PresetFilter.TOP_FIVE,
    description: "Top five most frequent genera",
    icon: "🏆",
  },
  {
    label: "Cherry blossoms",
    value: PresetFilter.HANAMI,
    icon: "🌸",
    description: "Seven genera of flowering cherry trees",
  },
  { label: "Fall colors", value: PresetFilter.FALL_COLORS, icon: "🍁" },
];

const ownerOptions = [
  { label: "All", value: Owner.ALL },
  { label: "SDOT", value: Owner.SDOT },
  { label: "Private", value: Owner.PRIVATE },
];

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  value: string;
  icon?: string;
  description?: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, description, icon, ...rest }: ItemProps, ref) => (
    <Group ref={ref} {...rest}>
      {icon}
      <Box>
        <Text>{label}</Text>
        {description && (
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        )}
      </Box>
    </Group>
  )
);

export default function Filters() {
  const theme = useMantineTheme();
  const { genuses, setGenuses, owner, setOwner } = useFilterContext();

  const [localGenuses, setLocalGenuses] = useState(genuses);
  const [localOwner, setLocalOwner] = useState(owner);

  useEffect(() => {
    setLocalGenuses(genuses);
    setLocalOwner(owner);
  }, [genuses, owner]);

  const onUpdateFilters = () => {
    setGenuses(localGenuses);
    setOwner(localOwner);
  };

  const onReset = () => {
    setLocalGenuses(genuses);
    setLocalOwner(owner);
  };

  return (
    <>
      <Select
        data={presetOptions}
        label="Choose a preset"
        clearable
        itemComponent={SelectItem}
      />
      <Divider my="md" label="or" labelPosition="center" />
      <MultiSelect
        data={genusOptions}
        defaultValue={Object.values(Genus)}
        itemComponent={SelectItem}
        label="Genera"
        onChange={(values) => setLocalGenuses(values as Genus[])}
        placeholder="Select genera to filter on"
        searchable
        styles={{ label: { color: theme.colors.dark[5] } }}
        value={localGenuses}
      />
      <Space h="md" />
      <Text fz="sm" fw={500} color="dark.5">
        Ownership
      </Text>
      <SegmentedControl
        data={ownerOptions}
        defaultValue={Owner.ALL}
        onChange={(value) => setLocalOwner(value as Owner)}
        value={localOwner}
        fullWidth
      />
      <Space h="lg" />
      <SimpleGrid cols={2} spacing="sm">
        <Button onClick={onReset} variant="outline">
          Reset
        </Button>
        <Button onClick={onUpdateFilters}>Update</Button>
      </SimpleGrid>
    </>
  );
}
